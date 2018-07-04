# Chain-Crafting
Chain Crafting is a custom crafting engine made for Minecraft Bedrock. It works by chaining the ```minecraft:interact``` component with events and component groups. Since this is a task you don't want to do by hand, I made this generator to do the work.
You can get the items you put into the "crafting table" back at any point in time by sneaking & interacting with the entity. That's one of the very special features of the Chain Crafting system: It saves the current input!

### Usage
Visit https://solveddev.github.io/Chain-Crafting or download this repository and open the index.html file in the browser of your choice. Write a JSON file to describe the recipes you want to add with the following syntax:
```javascript
{
	"entity": "minecraft:shulker",
	"recipes": [
		{
			"ingredients": [
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				}
			],
			"results": [
				{
					"item": "minecraft:iron_nugget",
					"data": 0,
					"count": 9
				}
			]
		}
	]
}
```
After a short amount of time, the page downloads the result of the generator as a .zip file. This archive contains a "loot_tables" & "entities" folder. In order to add the system to your behavior pack, drag the chain_crafting.zip file into your BP and unpackage it there. If you did it the right way, you should not see a "chain_crafting" folder in your BP. 

If you do, move the "entities" & "loot_tables" folder into the BP root folder and remove the now empty "chain_crafting" folder


### Other Examples
You can also add multiple ingredients. In this case, you start by interacting with the first item defined, then you need to interact with the second one, etc.
```javascript
{
	"entity": "minecraft:shulker",
	"recipes": [
		{
			"ingredients": [
				{
					"item": "minecraft:stick",
					"data": 0
				},
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				},
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				}
			],
			"results": [
				{
					"item": "minecraft:iron_sword",
					"data": 0,
					"count": 1
				}
			]
		}
	]
}
```

Chain Crafting also supports multiple results:
```javascript
{
	"entity": "minecraft:shulker",
	"recipes": [
		{
			"ingredients": [
				{
					"item": "minecraft:stick",
					"data": 0
				},
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				},
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				},
				{
					"item": "minecraft:iron_ingot",
					"data": 0
				}
			],
			"results": [
				{
					"item": "minecraft:iron_sword",
					"data": 0,
					"count": 1
				},
				{
					"item": "minecraft:iron_nugget",
					"data": 0,
					"count": 9
				}
			]
		}
	]
}
```