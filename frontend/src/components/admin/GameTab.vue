<template>
	<v-row>

		<v-col sm="12" lg="6">
			<v-card>
				<v-card-title>Apex Scoring</v-card-title>
				<v-card-text>
					<v-combobox v-model="game" label="Game" :items="[1, 2, 3, 4, 5, 6]"></v-combobox>
					<v-text-field v-model="statsCode" label="Apex Stats Code"></v-text-field>
					<v-expansion-panels>
						<v-expansion-panel>
							<v-expansion-panel-header>
								Game Selector
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<div class="game-select">
									<h3>Most Recent</h3>
									<game-select v-if="games" @click="selectedGame = games[0].match_start"
										:selected="selectedGame == games[0].match_start" :game="games[0]"></game-select>
									<h3>Other Games</h3>
									<template v-if="games">
										<game-select @click="selectedGame = game.match_start" v-for="game in games.slice(1)"
											:selected="selectedGame == game.match_start" :key="game.start_time" :game="game">
										</game-select>
									</template>
								</div>
							</v-expansion-panel-content>
						</v-expansion-panel>
						<v-expansion-panel>
							<v-expansion-panel-header>
								Advanced Options
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-text-field v-model.number="killPoints" label="Kill Points"></v-text-field>
								<v-text-field v-model="placementPoints" label="Placement Points"></v-text-field>
								<v-switch v-model="skipFetch" label="Dont pull stats, refresh only"></v-switch>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>

				</v-card-text>
				<v-card-actions>
					<v-btn color="blue" @click="addGame">Add Game</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
		<v-col sm="12" lg="6">
			<v-card >
				<v-card-title>Scores</v-card-title>
				<v-card-text class="small-text">
					<v-tabs v-model="tabs">
						<v-tab>Overall</v-tab>
						<v-tab v-for="(game, index) in stats.games" :key="index">{{game.game}}</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tabs">
						<v-tab-item>
							<simple-score-table :stats="stats"></simple-score-table>
						</v-tab-item>
						<v-tab-item v-for="(game, index) in stats.games" :key="index">
							<v-btn @click="deleteStats(game.game)">Delete</v-btn>
							<simple-score-table :stats="game"></simple-score-table>
						</v-tab-item>
					</v-tabs-items>
				</v-card-text>
			</v-card>
			
		</v-col>
	</v-row>
</template>

<script>
import SimpleScoreTable from './subcomponents/SimpleScoreTable.vue';
import GameSelect from './subcomponents/GameSelect.vue';

export default {
	components: {
		GameSelect,
		SimpleScoreTable
	},
	props: [
		"eventId",
		"organizer",
	],
	data() {
		return {
			tabs: undefined,
			game: 1,
			statsCode: undefined,
			skipFetch: false,
			games: undefined,
			selectedGame: 0,
			showGameSelect: false,
			placementPoints: "12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0",
			killPoints: 1,
			stats: {
				teams: []
			},
		}
	},
	watch: {
		async statsCode() {
			this.games = await this.$apex.getStatsFromCode(this.statsCode);
			if (this.games) {
				this.selectedGame = this.games[0].match_start;
			}
		}
	},
	methods: {
		async addGame() {
			await this.$apex.generateStats(
				this.eventId,
				this.statsCode.trim(),
				this.game,
				this.selectedGame,
				this.skipFetch,
				this.killPoints,
				this.placementPoints.split(",").map(n => parseInt(n)),
			);
			this.updateStats();
		},
		async updateStats() {
			this.stats = await this.$apex.getStats(this.organizer, this.eventId, "overall");
		},
		async deleteStats(game) {
			await this.$apex.deleteStats(this.organizer, this.eventId, game);
			await this.updateStats();
		}
	},
	mounted() {
		console.log("Getting Stats")
		this.updateStats();
	}
}
</script>

<style scoped>
.game-select {
	max-height: 500px;
	overflow: auto;
}

.small-text {
	font-size: .8em;
}
</style>