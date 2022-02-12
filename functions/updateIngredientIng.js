/**
 * @param  {[]} arr the whole ingrediens array
 * @param  {string} ing the ing id
 * @returns {[]} the updated ingredient array 
 */
async function updateIngredientIng(arr) {
    arr.forEach((ing, i, arr) => {
        ing.ing = ing._id;
    });
    return arr;
}

module.exports = updateIngredientIng;