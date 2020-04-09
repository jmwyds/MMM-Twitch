/* global Module */

/* Magic Mirror
 * Module: MMM-Twitch
 *
 * By John Wydra
 * {{LICENSE}} Licensed.
 */

Module.register("MMM-Twitch", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000,
		clientID: "krauvwrh60mb86r2pcki2i1q327m7i",
		numStreams: 5,
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		Log.info("Starting module: " + this.name);

		this.updateIntervalID = 0; // Definition of the IntervalID to be able to stop and start it again
		this.ModuleToDoIstHidden = false; // by default it is considered displayed. Note : core function "this.hidden" has strange behaviour, so not used here

		//to display "Loading..." at start-up
		this.title = "Loading...";
		this.loaded = false;

		if (this.config.clientID === "") {
			Log.error("MMM-Twitch: clientID not set!");
			return;
		}

		this.sendSocketNotification("FETCH_TWITCH", this.config);

		//add ID to the setInterval functionto be able to stop it later on
		this.updateIntervalID = setInterval(function () {
			self.sendSocketNotification("FETCH_TWITCH", self.config);
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		var urlApi = "https://api.twitch.tv/helix/steams?first=5?game_id=33214^;
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		//Add a new div to be able to display the update time alone after all the task
		var wrapper = document.createElement("div");

		//display "loading..." is not loaded
		if (!this.loaded) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = "normal small light";

		if (this.tasks === undefined) {
			return table;
		}

		// create mapping from user id to collaborator index
		var collaboratorsMap = new Map();
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"font-awesome.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-Twitch-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-Twitch-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
