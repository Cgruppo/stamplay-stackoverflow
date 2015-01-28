app.service('tagService', ['$q', '$http', function ($q, $http) {
	var STORAGE_ID = 'stamplay-stackoverflow-tag';
	// var tags = null;
	// var promise = $http.get('/api/cobject/v0/tags').then(function (response) {
	// 	tags = response.data;
	// });

	// return {
	// 	promise: promise,
	// 	getTags: function () {
	// 		return tags;
	// 	}
	// };
	var retrieveAllTags = function () {
		var tagsInLocalStorage = [];
		for (var key in localStorage) {
			if (key.indexOf('stamplay-stackoverflow-tag') != -1) {
				tagsInLocalStorage.push(retrieveTag(key));
			}
		}
		return tagsInLocalStorage;
	}


	var retrieveTag = function (id) {
		return JSON.parse(localStorage.getItem(STORAGE_ID + '-' + id) || '{}');
	}

	var cacheTag = function (tag) {
		localStorage.setItem(STORAGE_ID + '-' + tag['_id'], JSON.stringify(tag));
	}

	var resolveId = function (id) {
		var result = tags.filter(function (tag) {
			return tag.id == id
		});
		if (result[0] && result[0].name) {
			return result[0].name;
		} else {
			return null;
		}
	}

	var tags = retrieveAllTags();



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

	var populateTag = function (tags) {
		var def = $q.defer();
		var resultTags = [];
		async.each(tags, function (tag, eachCb) {
			var cachedTag = retrieveTag(tag);
			if (cachedTag._id) {
				resultTags.push(cachedTag);
				eachCb();
			} else {
				$http({
					method: 'GET',
					url: '/api/cobject/v0/tags/' + tag
				}).success(function (response) {
					resultTags.push(response);
					cacheTag(response);
					eachCb();
				})

			}
		}, function () {
			def.resolve(resultTags);
		})

		return def.promise;
	}

	return {
		getPromise: getPromise,
		getTags: function () {
			return tags;
		},
		populateTag: populateTag,
		resolveId: resolveId
	};
}])