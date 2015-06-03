document.addEventListener('DOMContentLoaded', function() {

	var playerList = [];

	var addPlayer = function( name ) {
		playerList.push({ name: name, level: 1, bonus: 0 });
		renderPlayerList();
	};

	var removePlayer = function( obj ) {
		if ( typeof obj === "number" ) {
			playerList.splice( obj, 1 );
			renderPlayerList();
		} else {
			var index = playerList.indexOf( obj );
			if ( index !== -1 ) {
				playerList.splice( index, 1 );
			}
		}
	};

	var addToPlayerStat = function( player, stat, by ) {
		player.stat += by;
		renderPlayerList();
	};

	var titleTemplate = "<tr class='title'>\
			<td class='name'></td>\
			<td class='stat level'>Уровень</td>\
			<td class='stat bonus'>Бонус</td>\
			<td class='stat strength large'>Боевая сила</td>\
		</tr>";

	var playerTemplate = "<tr class='player'>\
			<td class='name'>{name}</td>\
			<td class='stat level'>{level}</td>\
			<td class='stat bonus'>{bonus}</td>\
			<td class='stat strength large'>{strength}</td>\
		</tr>";

	var winTemplate = "<div class='center win'>{name} выиграл!</div>";

	var htmlToDom = function( html, inTbody ) {
		// http://stackoverflow.com/a/494348
		var swapElement = document.createElement( inTbody ? "tbody" : "div" );
		swapElement.innerHTML = renderedHtml;
		return swapElement.firstChild;
	};

	var renderPlayer = function( player ) {

		renderedHtml = playerTemplate.replace( /\{name\}/g, player.name )
			.replace( /\{level\}/g, player.level )
			.replace( /\{bonus\}/g, player.bonus )
			.replace( /\{strength\}/g, player.level + player.bonus );

		renderedDom = htmlToDom( renderedHtml, true );

		var handler = function( evt ) {

			evt.preventDefault();

			var changeBy = 0;

			// Left button, increase.
			if ( evt.button === 0 ) {
				changeBy = 1

			 // Right button, decrease.
			} else if ( evt.button === 2 || evt.type === "contextmenu" ) {
				changeBy = -1
			}

			// Change level.
			if ( [].indexOf.call( evt.target.classList, "level" ) !== -1 ) {
				player.level += changeBy
				if ( player.level < 1 ) {
					player.level = 1;
				} else if ( player.level > 10 ) {
					player.level = 10;
				}

				if ( player.level === 10 ) {
					document.body.innerHTML =
						winTemplate.replace( /\{name\}/g, player.name );
				}
			} else

			// Change bonus.
			if ( [].indexOf.call( evt.target.classList, "bonus" ) !== -1 ) {
				player.bonus += changeBy
			} else

			// Remove player.
			if ( [].indexOf.call( evt.target.classList, "name" ) !== -1 &&
				evt.button === 2 ) {
				removePlayer( player );
			}

			renderPlayerList();

		};

		renderedDom.addEventListener( "click", handler );
		renderedDom.addEventListener( "contextmenu", handler );

		return renderedDom;
	};

	var playerListElement =
		document.getElementsByClassName( "player-list" )[ 0 ];

	var renderPlayerList = function() {
		playerListElement.innerHTML = titleTemplate;
		for (var i = 0; i < playerList.length; i++) {
			playerListElement.appendChild( renderPlayer( playerList[i]) );
		};
	};

	var newPlayerFormElement =
		document.getElementsByClassName( "new-player-form" )[ 0 ];

	var newPlayerNameElement =
		document.getElementsByClassName( "new-player-name" )[ 0 ];

	newPlayerFormElement.addEventListener( "submit", function( evt ) {

		evt.preventDefault();
		if ( newPlayerNameElement.value.trim() !== "" ) {

			addPlayer( newPlayerNameElement.value );
			newPlayerNameElement.value = "";
			renderPlayerList();

		}

	});

});
