import fs from "fs";
import path from "path";

const testProjectsPath = path.join(__dirname, "../fixtures");

export default async () => {
	return new Promise(resolveFiles => {
		fs.readdir(testProjectsPath, {}, (err, files) => {
			Promise.all(
				files.map(file => {
					return new Promise(resolveStats => {
						fs.stat(path.join(testProjectsPath, file), (err, stats) => {
							resolveStats(stats);
						});
					});
				})
			).then(stats => {
				resolveFiles(
					files.filter((file, index) => {
						return stats[index].isDirectory();
					})
				);
			});
		});
	});
};
