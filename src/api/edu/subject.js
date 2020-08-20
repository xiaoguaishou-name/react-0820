import request from "@utils/request";

const BASE_URL = "/admin/edu/subject";

// 获取一级课程分类列表
export function reqGetSubject(page,limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}

//获取二级课程分类
export function reqGetSecSubject(parentId) {
    return request({
      url: `${BASE_URL}/get/${parentId}`,
      method: "GET",
    });
  }

//新增课程分类
export function reqAddSubject(title,parentId){
  return request({
    url:`${BASE_URL}/save`,
    method:'POST',
    data:{
      title,
      parentId
    }
  })
}

//更新课程
export function reqUpdateSubject(id,title){
  return request({
    url:`${BASE_URL}/update`,
    method:'PUT',
    data:{
      id,
      title
    }
  })
}

//删除课程
export function reqDelSubject(id){
  return request({
    url:`${BASE_URL}/remove/${id}`,
    method:'DELETE'
  })
}