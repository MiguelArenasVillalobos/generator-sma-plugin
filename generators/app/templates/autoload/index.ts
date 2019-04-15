/**
 * Any code that should automatically run when this plugin is loaded should go in the autoload directory.
 * Every file in this directory is autoloaded.
 * Remember to transpile to JavaScript!
 */
import { Logger } from '<%= name %>/lib/log'
import { commando } from '@magikcraft/core'
import * as events from 'events'

const log = Logger(__filename)

log('<%= name %> loaded!')

log('Registering Player Join event handler')

events.playerJoin(({ player }) => {
	setTimeout(() => {
		// Initial join is a bit chaotic
		echo(
			player,
			`Hi ${player.name}. The <%= name %> plugin is loaded on this server`
		)
	}, 1000)
})

log('Registering test command')

commando('test', (args, player) => {
	console.log(`Test command called by ${player.name}`)
	echo(player, 'Test command called')
})
