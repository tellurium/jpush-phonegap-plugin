var app = {
    events: {
        '.test': 'startTest'
    },

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        var key;

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        for (key in this.events) {
            if (!this.events.hasOwnProperty(key)) {
                continue;
            }
            document.body.querySelector(key).addEventListener('click', this[this.events[key]].bind(this), false);
        }
    },

    onDeviceReady: function() {
        console.log('Device is ready');
    },

    startTest: function () {
        // TODO ...

    },

    triggerPlugin: function (task, taskArgsArray) {
        var plugin = window.CordovaBaiduMapPlugin;

        if (!plugin) {
            console.error('Plugin is not loaded successfully');
            return;
        }

        if (!plugin[task] || typeof plugin[task] !== 'function') {
            console.error('Wrong task name ==>' + task + '<== for baidu-map plugin');
            return;
        }

        console.log('Ready to trigger ' + task + 'task');

        plugin[task].apply(plugin, taskArgsArray);
    }
};

app.initialize();
