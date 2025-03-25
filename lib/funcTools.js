export const getTagID = (tagFromDB,name = '') => {
    return tagFromDB.find(t => t.name === name)?._id
}
