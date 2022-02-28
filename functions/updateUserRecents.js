/**
 * @param  {{}} user the current authenticated user
 * @param  {string} type the array that needs changing 
 * @param  {{}} data the data to push into the array
 */
async function updateUserRecents(user, type, data) {
    const id = type === 'ingredients' ? 'ing' : 'rec';
    const i = user.recents[type].map(recent => recent.name).indexOf(data.name);
    if (i !== -1) {
        const push = user.recents[type][i];
        user.recents[type].splice(i, 1)
        user.recents[type].unshift(push);

    }
    else {
        if (user.recents[type].length >= 3) {
            user.recents[type].shift();
        }
        if (type === 'recipes') {
            user.recents[type].push({[id]: data.id, name: data.name, categories: data.categories, 
            calories: type === 'ingredients' ? data.calories.pref: data.calories, price: data.price, yield: `${data.yield.number} ${data.yield.string}`});    
        }
        user.recents[type].push({[id]: data.id, name: data.name, categories: data.categories, 
        calories: type === 'ingredients' ? data.calories.pref: data.calories, price: data.price});
    }
    await user.save();
}
module.exports = updateUserRecents;