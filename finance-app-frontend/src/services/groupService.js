import axiosInstance from './api';

export const createGroup = async (userId, groupData) => {
  return axiosInstance.post('/groups', groupData, {
    params: { userId }
  });
};

export const getGroups = async (userId) => {
  return axiosInstance.get('/groups', {
    params: { userId }
  });
};

export const addMemberToGroup = async (groupId, userId) => {
  return axiosInstance.post(`/groups/${groupId}/members`, null, {
    params: { userId }
  });
};

export const getGroupMembers = async (groupId) => {
  return axiosInstance.get(`/groups/${groupId}/members`);
};
