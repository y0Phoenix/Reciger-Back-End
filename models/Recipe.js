const mon = require('mongoose');

const RecipeSchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    ingredients: [{
        id: {
            type: mon.Schema.Types.ObjectId,
            default: null
        },
        quantity: {
            unit: {
                type: String,
                default: null
            },
            amount: {
                type: Number,
                default: null
            }
        },
        price: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        user: {
            type: mon.Schema.Types.ObjectId,
            required: true
        },
        categories: {
            type: [String],
            default: []
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
            fat: {
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
            carbs: {
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
            sugars: {
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
        }
    }],
    nutrients: {
        protein: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        fat: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        carbs: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        sugars: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        fiber: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        calcium: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        iron: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        sodium: {
            unit: {
                type: String,
                default: 'mg'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
    },
    price: {
        type: String,
        default: '$0.00'
    },
    categories: {
        type: [String],
        default: []
    },
    calories: {
        type: Number,
        default: 0
    },
    yield: {
        number: {
            type: Number,
            default: 0
        },
        string: {
            type: String,
            default: ''
        }
    }
});

const Recipe = mon.model('recipe', RecipeSchema);

module.exports = Recipe;