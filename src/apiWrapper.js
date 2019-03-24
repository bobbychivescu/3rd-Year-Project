import { API, Auth, Storage } from 'aws-amplify';
import { v1 } from 'uuid';
import axios from 'axios';

const getUser = async () => {
  const user = await API.get('3YP', '/profile');
  if (user.nickname) {
    return user;
  } else {
    return await firstLogin();
  }
};

const firstLogin = async () => {
  const cognitoUser = await Auth.currentAuthenticatedUser();

  await API.post('3YP', '/profile', {
    body: {
      email: cognitoUser.attributes.email
    }
  });

  return await API.get('3YP', '/profile');
};

const getContacts = async contactList => {
  return await API.get('3YP', '/profile/contacts', {
    queryStringParameters: {
      ids: contactList
    }
  });
};

const getGroups = async groupList => {
  const response = await API.get('3YP', '/groups', {
    queryStringParameters: {
      names: groupList
    }
  });

  if (response.toDelete) {
    deleteStale(response.toDelete);
  }
  return response.data;
};

const deleteStale = async groups => {
  const list = await Promise.all(
    groups.map(async group => {
      return await Storage.list('groups/' + group + '/');
    })
  );

  const flatList = [].concat.apply([], list);

  flatList.forEach(item => {
    Storage.remove(item.key);
  });

  if (flatList.length > 0) {
    await API.del('3YP', '/posts', {
      queryStringParameters: {
        toDelete: flatList.map(item => getIdfromKey(item.key))
      }
    });
  }
};

const getGroup = async name => {
  return await API.get('3YP', '/groups/' + name);
};

const createGroup = async group => {
  const response = await API.post('3YP', '/groups', {
    body: group
  });
  if (response.error) return false;

  if (group.members.length > 1) {
    //creating member not the only one
    API.put('3YP', '/profile/join', {
      body: {
        users: group.members
      }
    });
  }

  return true;
};

const removeMembers = async (groupName, members) => {
  return await API.put('3YP', '/groups/delete/' + groupName, {
    body: { members: members }
  });
};

const editGroup = async (groupName, data) => {
  return await API.put('3YP', '/groups/' + groupName, {
    body: data
  });
};

const addMembers = async (group, members) => {
  API.put('3YP', '/profile/join', {
    body: {
      users: [...group.members.values, ...members]
    }
  });

  return await API.put('3YP', '/groups/add/' + group.name, {
    body: { members: members }
  });
};

const createTextPost = async (path, text, userId) => {
  const id = v1();
  const response = await Storage.put(path + id + '.txt', text);
  API.post('3YP', '/posts', {
    body: { id: id, createdBy: userId }
  });
  response.id = id;
  response.createdBy = userId;
  return await enrich(response);
};

const createFilePost = async (path, file, userId) => {
  const id = v1();
  const response = await Storage.put(path + id + '.png', file, {
    contentType: file.type
  });
  API.post('3YP', '/posts', {
    body: { id: id, createdBy: userId }
  });
  response.id = id;
  response.createdBy = userId;
  return await enrich(response);
};

const getIdfromKey = key => key.substr(key.lastIndexOf('/') + 1, 36);

const getPosts = async path => {
  const list = await Storage.list(path);
  if (list.length > 0) {
    const meta = await API.get('3YP', '/posts', {
      queryStringParameters: {
        names: list.map(item => getIdfromKey(item.key))
      }
    });
    const posts = await Promise.all(list.map(enrich));
    return posts
      .map(post => {
        const info = meta.find(el => el.id === getIdfromKey(post.key));
        return { ...post, ...info };
      })
      .sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));
  } else return [];
};

const enrich = async item => {
  const url = await Storage.get(item.key);
  item.url = url;
  if (item.key.endsWith('.txt')) {
    const text = await axios.get(url);
    item.text = text.data;
  }
  return item;
};

const removeStaleData = async (state, set) => {
  const staleContacts = state.user.contacts
    ? state.user.contacts.values.filter(
        c => !state.contacts.map(item => item.userId).includes(c)
      )
    : [];

  const staleGroups = state.user.groups
    ? state.user.groups.values.filter(
        g => !state.groups.map(item => item.name).includes(g)
      )
    : [];

  const body = {};
  if (staleContacts.length > 0) body.contacts = staleContacts;
  if (staleGroups.length > 0) body.groups = staleGroups;

  if (body.contacts || body.groups) {
    const resp = await API.put('3YP', '/profile/delete', {
      body: body
    });
    const u = { ...state.user, ...resp.data.Attributes };
    set({ user: u });
  }
};

const notify = async (users, notification) => {
  //add email sending
  return await API.patch('3YP', '/profile', {
    body: {
      users: users,
      notification: notification
    }
  });
};

const clearNotifications = async () => {
  return await API.patch('3YP', '/profile/clear');
};

const deleteGroup = async group => {
  await API.del('3YP', '/groups/' + group);
  await deleteStale([group]);
};

export {
  getUser,
  getContacts,
  getGroups,
  getGroup,
  createGroup,
  removeMembers,
  editGroup,
  addMembers,
  createTextPost,
  createFilePost,
  getPosts,
  removeStaleData,
  notify,
  clearNotifications,
  deleteGroup
};
