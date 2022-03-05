/**
 * @param  {[]} cats the category with which to check
 * @param  {{}} user the user with the categories
 * @param  {string} type the type of category (ingredient or recipe)
 * @returns {boolean} if the operation was successfull
 */
async function updatUserCategories(cats, user, type) {
    var ret = []
    cats.forEach((cat, i, arr) => {
        cat = cat.replace(/s/g, '')
        const index = user.categories[type].indexOf(cat);
        if (index <= -1) {
            ret.push(cat);
        }
    });
    if (ret.length > 0) {
        ret.forEach((cat, i, arr) => {

            user.categories[type].push(cat.replace(/s/g, ''));
        })
        await user.save();
    }
    return true;
}

module.exports = updatUserCategories;