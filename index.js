const NtpTimeSync = require("ntp-time-sync").NtpTimeSync;
const express = require("express");
const open = require("open");
const app = express();
const port = 8888;

// Others include time.facebook.com, time.euro.apple.com, pool.ntp.org:123
const timeServer = "time.google.com";

// Allow all files to be requested
app.use("/", express.static(__dirname));

app.get("/", (req, res) => {
	res.sendFile("server.html", { root: __dirname });
});

app.get("/offset", (req, res) => {
	try {
		new NtpTimeSync({
			servers: [timeServer]
		}).getTime().then(time => {
			res.send({ offset: Math.trunc(time.offset) });
		}).catch(err => {
			console.error(err);
			res.status(400).send();
		});
	} catch (err) {
		console.error(err);
		res.status(400).send();
	}
});

app.listen(port, () => {
	const hostUrl = `http://localhost:${port}`;
	console.log(`Listening on ${hostUrl}`);
	open(hostUrl);
});