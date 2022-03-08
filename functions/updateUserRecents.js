/**
 * @param  {{}} user the current authenticated user
 * @param  {string} type the array that needs changing 
 * @param  {{}} data the data to push into the array
 */
async function updateUserRecents(user, type, data, del = false) {
    const id = type === 'ingredients' ? 'ing' : 'rec';
    const i = user.recents[type].map(recent => recent.name).indexOf(data.name);
    if (i !== -1) {
        user.recents[type].splice(i, 1);
        if (del) return await user.save();
        if (type === 'ingredients') {
            user.recents[type].unshift({ing: data.id, name: data.name, categories: data.categories, calories: data.calories.pref, price: data.price, date: Date.now()});
        }
        else {
            const yield = `${data.yield.number} ${data.yield.string}`;
            user.recents[type].unshift({rec: data.id, name: data.name, categories: data.categories, calories: data.calories.total, price: data.price, yield: yield, date: Date.now()});
        }     

    }
    else {
        if (user.recents[type].length >= 3) {
            user.recents[type].shift();
        }
        if (type === 'recipes') {
            user.recents[type].push({[id]: data.id, name: data.name, categories: data.categories.total, 
            calories: data.calories, price: data.price, yield: `${data.yield.number} ${data.yield.string}`});    
        }
        else {
            user.recents[type].push({[id]: data.id, name: data.name, categories: data.categories, 
            calories: data.calories.pref, price: data.price});
        }
    }
    await user.save();
}
module.exports = updateUserRecents;