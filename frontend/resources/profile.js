//getting the username from the url params
const username = window.location.href.split("?")[1].split("=")[1];
const apiUrl = "http://localhost:3333/data/";

const followersChart = document.getElementById('followersChart');
const followingChart = document.getElementById('followingChart');
const ratioChart = document.getElementById('ratioChart');

const profileName = document.getElementById('profile_name');
const profileFollowers = document.getElementById('profile_followers');
const profileFollowing = document.getElementById('profile_following');
const profilePosts = document.getElementById('profile_posts');

const defaultOptions = {
    type: 'line',
    data: {},
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        tension: 0.2,
        responsive: true,
        maintainAspectRatio: false,
        color: 'white',
    }
}

//fetching the user data asynchronously
getData = async () => {
    const response = await fetch(`${apiUrl}${username}`)
    const jsondata = await response.json();

    profileName.innerHTML = username;
    const lastUpdate = jsondata[Object.keys(jsondata).length - 1];

    if(lastUpdate.posts_count == null){
        lastUpdate.posts_count = 0;
    }
    if(lastUpdate.followers_count == null){
        lastUpdate.followers_count = 0;
    }
    if(lastUpdate.following_count == null){
        lastUpdate.following_count = 0;
    }

    profileFollowers.innerHTML = lastUpdate.followers_count;
    profileFollowing.innerHTML = lastUpdate.following_count;
    profilePosts.innerHTML = lastUpdate.posts_count;
}

setFollowersGraph = async () => {
    const ctx = document.getElementById('followersChart');

    const response = await fetch(`${apiUrl}${username}/followers`);
    const jsondata = await response.json();

    const labels = [];
    const dataValues = [];

    for (const data of jsondata) {
        labels.push(new Date(data.timestamp).toLocaleDateString());
        dataValues.push(data.followers_count);
    }

    const dataForSet = await getDataForSet(labels, dataValues, 'Followers');
    const followersOptions = JSON.parse(JSON.stringify(defaultOptions));;
    followersOptions.data = dataForSet;
    console.log(followersOptions);

    new Chart(ctx, followersOptions);
}

setFollowingGraph = async () => {
    const ctx2 = document.getElementById('followingChart');

    const response = await fetch(`${apiUrl}${username}/following`);
    const jsondata = await response.json();

    const labels = [];
    const dataValues = [];

    for (const data of jsondata) {
        labels.push(new Date(data.timestamp).toLocaleDateString());
        dataValues.push(data.following_count);
    }

    const dataForSet = await getDataForSet(labels, dataValues, 'Following');
    const followingOptions = JSON.parse(JSON.stringify(defaultOptions));;
    followingOptions.data = dataForSet;

    new Chart(ctx2, followingOptions);
}

setFollowersRatioChart = async () => {
    const ctx3 = document.getElementById('ratioChart');

    const response = await fetch(`${apiUrl}${username}/follower-ratio`);
    const jsondata = await response.json();

    const labels = [];
    const dataValues = [];

    for (const data of jsondata) {
        labels.push(new Date(data.timestamp).toLocaleDateString());
        dataValues.push(data.follower_ratio);
    }

    const dataForSet = await getDataForSet(labels, dataValues, 'Followers/Following Ratio');
    const ratioOptions = JSON.parse(JSON.stringify(defaultOptions));;
    ratioOptions.data = dataForSet;

    new Chart(ctx3, ratioOptions);
}

getDataForSet = async (labels, data, title) => {
    const followingOptions = {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            borderWidth: 1,
            borderColor: '#449282',
            backgroundColor: '#9BD0F5',

        }]
    }

    const followersOptions = {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            borderWidth: 1,
            borderColor: '#FFCCE4',
            backgroundColor: '#FFCCE4',

        }]
    }

    const ratioOptions = {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            borderWidth: 1,
            borderColor: '#36A2EB',
            backgroundColor: '#9BD0F5',

        }]
    }

    switch (title) {
        case 'Followers':
            return followersOptions;
        case 'Following':
            return followingOptions;
        case 'Followers/Following Ratio':
            return ratioOptions;
    }

    return ratioOptions;
}

main= async () => {
    await getData();

    await setFollowersGraph();
    await setFollowingGraph();
    await setFollowersRatioChart();
}

main();
