var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    }

}, {
	getterMethods: {
		route: function() {return "/wiki/" + this.urlTitle}
	}, 
	hooks: {
		beforeValidate: function(page) {
			console.log(page.title);
			if (page.title) {
				page.urlTitle = page.title;
				page.urlTitle.replace(/\s/g, '_');
				page.urlTitle.replace(/\W/g, '');
			}
			else {
				page.urlTitle = '';
				var alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
				for (var i = 0; i < 5; i++) {
					var randIdx = Math.floor(Math.random()*36);
					page.urlTitle += alphabet[randIdx];
				}
			}
		}
	}
}
);

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};