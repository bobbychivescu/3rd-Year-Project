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
  //add group to user record
  //join contacts
  return true;
};

const removeMembers = async (groupName, members) => {
  //delete group for userS recordS
  //change back to accept this action from anywhere
  return await API.put('3YP', '/groups/delete/' + groupName, {
    body: { members: members }
  });
};

const editGroup = async (groupName, data) => {
  return await API.put('3YP', '/groups/' + groupName, {
    body: data
  });
};

const addMembers = async (groupName, members) => {
  //add group to userS recordsS
  //join new members and old memebr in contacts
  //change back to accept this action from anywhere
  return await API.put('3YP', '/groups/add/' + groupName, {
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
