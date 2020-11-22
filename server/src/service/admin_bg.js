// import adminSchema from '../db/schema/admin'
import bcrypt from 'bcrypt'


export const getAdmins = async () => {
    // let originResult = await adminSchema.lrange(0, -1)
    // if(originResult && originResult.length) { 
    //     let result = originResult.map(item => JSON.parse(item))
    //     return result
    // }else {
    //     return []
    // }
}

export const findAdmin = async (name) => {
    let admins = await getAdmins()
    if(admins.length) {
        let result = admins.filter(item => item.username === name)
        return result
    }else {
        return []
    }
    
}

export const addAdmin = async (query) => {
    let admin = await findAdmin(query.username)
    if(admin.length) {
        return null
    }else {
        // 生成加密hash密码
        let hash = bcrypt.hashSync(query.pwd, 8)
        query.pwd = hash
        query.role = +query.role
        let result = query
        return result
    }
}

export const editAdmin = async (query) => {
    let admins = await getAdmins()
    let index = -1
    admins.forEach((item, i) => {
        if(item.username === query.prevName) {
            index = i
            return
        }
    })
    
    if(admins[index].pwd !== query.pwd) {
        // 生成加密hash密码
        let hash = bcrypt.hashSync(query.pwd, 8)
        query.pwd = hash
    }

    query.role = +query.role
    let result = query
    return result
}

export const loginAdmin = async (query) => {
    let admin = await findAdmin(query.username)
    if(admin.length) {
        let { pwd, username, role } = admin[0]
        let match = bcrypt.compareSync(query.pwd, pwd)
        return match ? { username, role } : null
    }else {  // 用户不存在
        return null
    }
}

// 初始化管理员数据，目前先放在这个位置
export const initAdmin = async (query) => {
    let admins = await adminSchema.lrange(0, -1)
    if(!admins || !admins.length) {
        let hash = bcrypt.hashSync(query.pwd, 8)
        query.pwd = hash
        return await query
    }
}