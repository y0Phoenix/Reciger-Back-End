const mon = require('mongoose');

const IngredientSchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    type: {
        type: String,
        default: 'ingredient'
    },
    units: {
        prefered: {
            type: String,
            required: true
        },
        weight: {
            type: [String],
        },
        volume: {
            type: [String]
        }
    },
    calories: {
        g: {
            type: Number,
            default: 0
        },
        oz: {
            type: Number,
            default: 0
        },
        ml: {
            type: Number,
            default: 0
        },
        floz: {
            type: Number,
            default: 0
        },
        pref: {
            type: Number,
            default: 0
        },
    },
    nutrients: {
        protein: {
            unit: {
                type: String,
                default: 'g'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        fat: {
            unit: {
                type: String,
                default: 'g'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        carbs: {
            unit: {
                type: String,
                default: 'g'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        sugars: {
            unit: {
                type: String,
                default: 'g'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        fiber: {
            unit: {
                type: String,
                default: 'mg'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        calcium: {
            unit: {
                type: String,
                default: 'mg'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        iron: {
            unit: {
                type: String,
                default: 'mg'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
        sodium: {
            unit: {
                type: String,
                default: 'mg'
            },
            g: {
                type: Number,
                default: 0
            },
            oz: {
                type: Number,
                default: 0
            },
            ml: {
                type: Number,
                default: 0
            },
            floz: {
                type: Number,
                default: 0
            },
            pref: {
                type: Number,
                default: 0
            }
        },
    },
    categories: {
        type: [String],
        default: []
    },
    img: {
        type: String,
        default: ''
    }
});

const Ingredient = mon.model('Ingredient', IngredientSchema);

module.exports = Ingredient;