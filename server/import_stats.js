const statsService = require("./services/stats.service");
const { readdirSync, readFileSync } = require('fs');
const { resolve } = require("path");

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const getFiles = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)

let root = resolve(__dirname + "/stats")
let dirs = getDirectories(root);

(async () => {
    let matches = dirs
        .map(dir => ({
            dir, files: getFiles(resolve(root, dir))
                .filter(file => file != "overall.json" && file.includes(".json"))
        }))
        .filter(match => match.files.includes("4.json"))

    matches = matches.map(match => ({
        ...match,
        stats: match.files.map(file => JSON.parse(readFileSync(resolve(root + "/" + match.dir, file))))
    })).filter(match => match.stats[0].map_name);


    matches = matches.sort((a, b) => a.stats[0].match_start - b.stats[0].match_start)

    for (let match of matches.slice(1)) {
        for (let index = 0; index < match.stats.length; index++) {
            let stat = match.stats[index];
            stat.teams = stat.teams.map(team => {
                delete team.overall_stats.teamName
                return {
                    id: team.player_stats[0].teamNum,
                    name: team.name,
                    overall_stats: {
                        ...team.overall_stats,
                        survivalTime: 0,
                    },
                    player_stats: team.player_stats.map(s => ({ ...s, survivalTime: 0 }))
                }
            });
            await statsService.writeStats(2, match.dir, index + 1, stat);
        }
        console.log("Inserted ", match.dir)
    }
    console.log("done")
})();




