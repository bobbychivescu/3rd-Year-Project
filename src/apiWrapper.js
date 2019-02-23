import { API, Auth } from 'aws-amplify';

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
  return await API.get('3YP', '/groups', {
    queryStringParameters: {
      names: groupList
    }
  });
};

export { getUser, getContacts, getGroups };
