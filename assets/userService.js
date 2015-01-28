app.service('userService', ['$q', '$http', function ($q, $http) {
	var STORAGE_ID = 'stamplay-stackoverflow-user';

	var retrieveAllUsers = function () {
		var usersInLocalStorage = [];
		for (var key in localStorage) {
			if (key.indexOf('stamplay-stackoverflow-user') != -1) {
				usersInLocalStorage.push(retrieveUser(key));
			}
		}
		return usersInLocalStorage;
	}


	var retrieveUser = function (id) {
		return JSON.parse(localStorage.getItem(STORAGE_ID + '-' + id) || '{}');
	}

	var cacheUser = function (user) {
		user.dt_cache = new Date().getTime();
		localStorage.setItem(STORAGE_ID + '-' + user['_id'], JSON.stringify(user));
	}


	var users = retrieveAllUsers();

	var getPromise = function () {
		var def = $q.defer();
		if (tags) {
			def.resolve();
		} else {
			$http.get('/api/cobject/v0/tags').success(function (response) {
				tags = response.data;
				tags.forEach(cacheTag);
				def.resolve();
			}).error(function () {});
		}
		return def.promise;
	}

	var fetchAll = function () {
		return $http({
			method: 'GET',
			url: '/api/user/v0/users/',
		}).success(function (response) {
			response.data.forEach(function (user) {
				cacheUser(user);
			});
		})
	}

	var populateAuthor = function (author) {
		var def = $q.defer();
		var cachedAuthor = retrieveUser(author);
		if (cachedAuthor._id) {
			def.resolve(cachedAuthor);
		} else {
			$http({
				method: 'GET',
				url: '/api/user/v0/users/' + author,
				params: {
					select: 'displayName'
				}
			}).success(function (response) {
				cacheUser(response);
				def.resolve(author);
			})

		}
		return def.promise;
	}

	return {
		getPromise: getPromise,
		fetchAll: fetchAll,
		populateAuthor: populateAuthor,
	};
}])