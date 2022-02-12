# Reciger Back-End API 

This Is The Back-End API Service for *Reciger* which is a recipe manager with nutrient data, and more, it is built with *Express and Node* and uses *MongoDB*. The [Front-End](https://github.com/y0Phoenix/Reciger) is built with *React*. 

## Table of Contents

1. [Nutritional Data](#nut)
2. [Road Map](#roadmap)

### <a name="nut">Nutritional Data</a>

This Application Interacts with the USDA Food API which is where all the nutritional and caloric data comes from. Everytime a new Ingredient request is made this API is called and the nutritional data is parsed into the format needed for this full-stack application

The data taken includes

| Nutrient | Unit |
| -------- | ---- |
| Calories     | kCal   |
| Protein     | g   |
| Fat     | g   |
| Carbs     | g   |
| Sugars     | g   |
| Fiber     | mg   |
| Calcium     | mg   |
| Iron     | mg   |
| Sodium     | mg   |

### <a name="roadmap">Road Map</a>

1. Google Image Searching For Ingredients and Recipes which the user can then select from which one they prefer. Not sure yet if this functionality will be on the front-end or the back-end but the img property already exists on the Ingredient and Recipe Schemas so it is ready for future build

2. Food price searching. I have found a website which has a database of tons of food prices, just need a way to scrap their website as they don't have an API with which to make requests to. Not sure if this is possible but will for sure try