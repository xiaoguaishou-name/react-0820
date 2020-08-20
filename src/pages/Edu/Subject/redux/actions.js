import {reqGetSubject,reqGetSecSubject,reqUpdateSubject,reqDelSubject} from '@api/edu/subject'
import {GET_SUBJECT_LIST,GET_SEC_SUBJECT_LIST,UPDATE_SUBJECT_LIST,DEL_SUBJECT_LIST} from './constants'
//获取一级分类
const getSubjectListSync = (list) =>({
    type:GET_SUBJECT_LIST,
    data:list
})
export const getSubjectList = (page,limit) =>{
    return(dispatch)=>{
        return reqGetSubject(page,limit).then((res)=>{
            dispatch(getSubjectListSync(res))
            return res.total
        })
    }
}

//获取二级
const getSecSubjectListSync = (list) =>({
    type:GET_SEC_SUBJECT_LIST,
    data:list
})
export const getSecSubjectList = (parentId) =>{
    return(dispatch)=>{
        return reqGetSecSubject(parentId).then((res)=>{
            dispatch(getSecSubjectListSync(res))
            return res.total
        })
    }
}

//更新课程分类数据
const updateSubjectListSync = (list) =>({
    type:UPDATE_SUBJECT_LIST,
    data:list
})
export const updateSubjectList = (id,title) =>{
    return(dispatch)=>{
        return reqUpdateSubject(id,title).then((res)=>{
            dispatch(updateSubjectListSync({id,title}))
            return res.total
        })
    }
}

//删除课程分类数据
const delSubjectListSync = (data) =>({
    type:DEL_SUBJECT_LIST,
    data
})
export const delSubjectList = (id) =>{
    return (dispatch)=>{
        return reqDelSubject(id).then((res)=>{
            dispatch(delSubjectListSync(id))
            return res.total
        })
    }
}