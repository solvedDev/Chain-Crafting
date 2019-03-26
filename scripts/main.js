var entity = {
	"format_version": "1.8.0",
	"minecraft:entity": {
		"description": {
			"identifier": "",
			"is_spawnable": true,
			"is_summonable": true,
			"is_experimental": true
		  },
		"components": {
			"minecraft:health": {
				"value": 2,
				"max": 2
			},
			"minecraft:damage_sensor": {
				"cause": "any",
				"deals_damage": false
			},
			"minecraft:knockback_resistance": {
				"value": 100,
				"max": 100
			},
			  "minecraft:push_through": {
			  "value": 1
			},
			"minecraft:loot": {
				"table": "loot_tables/act.json"
			},
			"minecraft:physics": {}
		},
		"component_groups": {
			"chain:base_state": {
				"minecraft:interact": [],
				"minecraft:spell_effects": {
					"add_effects": [
						{
							"effect": "strength",
							"duration": 9999,
							"visible": false
						}
					],
					"remove_effects": [ "haste", "jump_boost" ]
				}
			}
		},
		"events": {
			"minecraft:entity_spawned": {
				"add": {
					"component_groups": [
						"chain:base_state"
					]
				},
				"remove": {}
			}
		}
	}
};
var manifest = {
		"format_version": 1,
		"header": {
			"description": "BP(Chain Crafting by solvedDev + Advanced Crafting Table by DrAv0011)",
			"name": "BP(Chain Crafting + Advanced Crafting Table)",
			"uuid": "ab7eaccb-53ec-4417-a417-7b11aba7566b",
			"version": [1, 0, 0]
		},
		"modules": [
			{
				"description": "BP(Chain Crafting by solvedDev + Advanced Crafting Table by DrAv0011)",
				"type": "data",
				"uuid": "bbb90cbb-0c26-4731-9de7-93655b5720fb",
				"version": [1, 0, 0]
			}
		]
}
var c_names = [];
var loot = { normal: {}, results: {} };
class Interaction {
	constructor(pFilters=[], pEvent, pUseItem, pInteractText, pTable, pSound="armor.equip_chain") {
		this.on_interact = {};
		this.on_interact.filters = { all_of: pFilters };
		this.use_item = pUseItem;
		this.play_sounds = pSound;
		this.interact_text = pInteractText;
		this.on_interact.event = pEvent;
		if(pTable) this.spawn_items = { table: pTable };
	}
}
class Loot {
	constructor(pItems, pEnd=pItems.length) {
		this.pools = [];
		for(let i = 0; i < pEnd; i++) {
			this.pools.push({
				"rolls": 1,
				"entries": [
					{
						"type": "item",
						"name": pItems[i].item,
						"weight": 1,
						"functions": [
							{
								"function": "set_data",
								"data": pItems[i].data ? pItems[i].data : 0
							},
							{
								"function": "set_count",
								"count": pItems[i].count ? pItems[i].count : 1
							}
						]
					 }
				]
			});
		}
	}
}


function loadFile(pFile) {
	var reader = new FileReader();
	//Reading file
	reader.readAsText(pFile);
	reader.onload = function() {
		parseCrafting(JSON.parse(reader.result));
	};
}

function parseCrafting(pC) {
	entity["minecraft:entity"]["description"]["identifier"] = pC["entity"];
	let recipes = pC["recipes"];

	for(let i = 0; i < recipes.length; i++) {
		generateRecipe(recipes[i]);
	}
	entity["minecraft:entity"].events["minecraft:entity_spawned"].remove.component_groups = c_names;
	entity["minecraft:entity"].events["chain_event:fall_back"] = entity["minecraft:entity"].events["minecraft:entity_spawned"];

	console.log(entity, loot);
	addToZip("entities/" + pC["entity"].split(":")[1] + ".json", JSON.stringify(entity, undefined, "\t"));
	for(let key in loot.results) {
		addToZip("loot_tables/chain_crafting/result/"+ key + ".json", JSON.stringify(loot.results[key], undefined, "\t"));
	}
	for(let key in loot.normal) {
		addToZip("loot_tables/chain_crafting/destruct/"+ key + ".json", JSON.stringify(loot.normal[key], undefined, "\t"));
	}
	addToZip("manifest" + ".json", JSON.stringify(manifest, undefined, "\t"));
	downloadZip("cc+act_bp.mcpack");
	location.reload();
}

function generateRecipe(pR) {
	let ingredients = pR["ingredients"];
	let results = pR["results"];

	for(let i = 0; i <= ingredients.length; i++) {
		generateState(ingredients[i], ingredients, i, i == 0, i == ingredients.length, results);
	}
}

function generateState(pS, pArr, pEnd, pFirst, pLast, pResults) {
	let component_groups = entity["minecraft:entity"]["component_groups"];
	let events = entity["minecraft:entity"]["events"];
	let key = getStateName(pArr, pEnd);
	let event_key = "";

	if(!pLast) event_key = getStateName(pArr, pEnd+1, "chain_event:on_");
	if(pFirst) key = "chain:base_state";

	if(key in component_groups) {
		let interact = component_groups[key]["minecraft:interact"];
		if(pLast) {
			interact.push(getInteraction(pS, event_key, pLast, key));
			//SHOW STATE
			component_groups[key]["minecraft:is_shaking"] = {};
		} else if(!containsInteract(interact, event_key)) {
			interact.unshift(getInteraction(pS, event_key, pLast, key));
		}
	} else {
		c_names.push(key);
		component_groups[key] = {};
		component_groups[key]["minecraft:interact"] = [getInteraction(pS, event_key, pLast, key)];

		let def_event_key = getStateName(pArr, pEnd, "chain_event:on_");
		//ADD
		events[def_event_key] = {};
		events[def_event_key].add = {};
		events[def_event_key].add.component_groups = [key];
		//REMOVE
		events[def_event_key].remove = {};
		let remove = getStateName(pArr, pEnd-1);
		if(pEnd-1 == 0) remove = "chain:base_state";
		events[def_event_key].remove.component_groups = [remove];

		if(!pLast) {
			//DESTRUCT
			component_groups[key]["minecraft:interact"].push(getDestroyInteraction(key));
			//SHOW STATE
			component_groups[key]["minecraft:spell_effects"] = {
				add_effects: [
					{
						effect: "haste",
						duration: 9999,
						visible: false
					}
				],
				remove_effects: [ "strength" ]
			};
		} else {
			//DESTRUCT
			component_groups[key]["minecraft:interact"].push(getDestroyInteraction(key));
			//SHOW STATE
			component_groups[key]["minecraft:spell_effects"] = {
				add_effects: [
					{
						effect: "jump_boost",
						duration: 9999,
						visible: false
					}
				],
				remove_effects: [ "strength", "haste" ]
			};
			component_groups[key]["minecraft:is_shaking"] = {};
		}
	}

	if(pLast) {
		loot.results[key.split(":")[1]] = new Loot(pResults);
		loot.normal[key.split(":")[1]] = new Loot(pArr, pEnd);
	} else {
		loot.normal[key.split(":")[1]] = new Loot(pArr, pEnd);
	}
}

function getInteraction(pS, pEventKey, pLast, pKey) {
	if(!pLast) {
		return generateInteraction(pS, pEventKey);
	} else {
		return generateCraftInteraction(pKey);
	}
}

function generateInteraction(pS, pEventKey) {
	let filters = [{ test: "is_sneaking", "subject": "other", "operator": "not" }];
	filters.push({ test: "is_family", subject: "other", value: "player" });
	filters.push({ test: "has_equipment", subject: "other", domain: "hand", value: pS.item.split(":")[1] + ":" + pS.data});

	let tmp = new Interaction(filters, pEventKey, true, "Add!", undefined, "attach");
	return tmp;
}

function generateCraftInteraction(pKey) {
	let filters = [{ test: "is_family", subject: "other", value: "player" }, { test: "is_sneaking", "subject": "other", "operator": "not" }];
	let tmp = new Interaction(filters, "chain_event:fall_back", false, "Craft!", "loot_tables/chain_crafting/result/" + pKey.split(":")[1] + ".json");

	return tmp;
}

function getDestroyInteraction(pKey) {
	let filters = [{ test: "is_family", subject: "other", value: "player" }, { test: "is_sneaking", "subject": "other" }];
	let tmp = new Interaction(filters, "chain_event:fall_back", false, "Remove Items!", "loot_tables/chain_crafting/destruct/" + pKey.split(":")[1] + ".json", "glass");

	return tmp;
}

function getStateName(pEndArr, pEnd, pPrefix="chain:") {
	let name = "";
	for(let i = 0; i < pEnd; i++) {
		name += pEndArr[i].item.split(":")[1] + "_" + pEndArr[i].data;
		if(i+1 < pEnd) name += "_";
	}
	return pPrefix + name;
}

function containsInteract(pInteract, pName) {
	for(let i = 0; i < pInteract.length; i++) {
		if(pInteract[i].on_interact.event == pName) {
			return true;
		}
	}
	return false;
}