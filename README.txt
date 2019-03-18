### Chain-Crafting
Chain Crafting is a custom crafting engine made for Minecraft Bedrock. It works by chaining the ```minecraft:interact``` component with events and component groups. Since this is a task you don't want to do by hand, I made this generator to do the work.
You can get the items you put into the "crafting table" back at any point in time by sneaking & interacting with the entity. That's one of the very special features of the Chain Crafting system: It saves the current input!

### Usage
Write a JSON file to describe the recipes you want to add with the following syntax:

{
	"entity": "av:act",
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

You also have an example of multiple crafting recipes in one file in the main folder. Open the index.html file found in the main folder, then click on "import JSON file" and upload your already written JSON file.
After a short amount of time, the page downloads the result of the generator as a "cc+act_bp.mcpack" file, open it, and once loaded open the "cc+act_rp.mcpack" file stored in the main folder.
Now just create a world, add the behaviour pack and the resource pack to it, enable experimental gameplay, and have fun :D

For now is only possible to summon the ACT in creative, so for it to not be destroyed by accident the entity is not punchable. To remove it, stand next to it and enter the following minecraft command "/kill @e[type=!player,c=1]

### Other Examples
You can also add multiple ingredients. In this case, you start by interacting with the first item defined, then you need to interact with the second one, etc.

{
	"entity": "av:act",
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


Chain Crafting also supports multiple results:

{
	"entity": "av:act",
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


### Credits

The original creator of the Chain Crafting (CC) system used in this generator is solvedDev (https://twitter.com/solvedDev), the creator of the Advanced Crafting Table (ACT), and modifier of the CC system is DrAv0011 (https://twitter.com/DrAv0011)(https://www.youtube.com/channel/UCFUG8RhqH6y1wfcVpLR7fFg).
The texture of the ACT is from the old Minecraft Java mod RedPower2.