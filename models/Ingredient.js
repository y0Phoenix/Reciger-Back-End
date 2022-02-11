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