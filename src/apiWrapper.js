import { API, Auth, Storage } from 'aws-amplify';

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
  const user = await API.get('3YP', '/profile');

  //make this better
  const text = 'Welcome to the app ' + user.nickname;
  API.post('3YP', '/email', {
    body: {
      to: user.attributes.email,
      subject: 'Welcome',
      text: text
    }
  });
  return user;
};

const getContacts = async contactList => {
  return await API.get('3YP', '/profile/contacts', {
    queryStringParameters: {
      ids: contactList
    }
  });
};

const getGroups = async groupList => {
  //change backend to return groups to delete
  //call remove group and pics, no await
  return await API.get('3YP', '/groups', {
    queryStringParameters: {
      names: groupList
    }
  });
};

const getGroup = async name => {
  return await API.get('3YP', '/groups/' + name);
};

const createGroup = async group => {
  const response = await API.post('3YP', '/groups', {
    body: group
  });
  //check response and return true for ok, false for duplicate

  group.members.forEach(userId => {
    const toEdit = {
      userId: userId,
      groups: [group.name]
    };

    if (group.members.length > 1)
      //creating member not the only one
      toEdit.contacts = group.members.filter(id => id !== userId);

    API.put('3YP', '/profile/add', {
      body: toEdit
    }).then(data => console.log('from callback' + JSON.stringify(data)));
  });

  return true;
};

const removeMembers = async (groupName, members) => {
  members.forEach(userId => {
    API.put('3YP', '/profile/delete', {
      body: {
        userId: userId,
        groups: [groupName]
      }
    }).then(data =>
      console.log('from callback add old to new' + JSON.stringify(data))
    );
  });
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
  members.forEach(userId => {
    API.put('3YP', '/profile/add', {
      body: {
        userId: userId,
        groups: [group.name],
        contacts: group.members.values
      }
    }).then(data =>
      console.log('from callback add old to new' + JSON.stringify(data))
    );
  });

  group.members.values.forEach(userId => {
    API.put('3YP', '/profile/add', {
      body: {
        userId: userId,
        contacts: members
      }
    }).then(data =>
      console.log('from callback add new to old' + JSON.stringify(data))
    );
  });

  return await API.put('3YP', '/groups/add/' + group.name, {
    body: { members: members }
  });
};

export {
  getUser,
  getContacts,
  getGroups,
  getGroup,
  createGroup,
  removeMembers,
  editGroup,
  addMembers
};