import { Logger } from '<%= name %>/lib/log'
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
