const routes = { //it is shared JSON or JS file which is loaded into notification center component
    'SIGN_ARTICLE_LICENSE': (payload) => `/noification-centre-novella/as/index.html#sign?license=${payload.id}&type=article`,
    'REVIEW_ARTICLE': (payload) => `/noification-centre-novella/spr/index.html#review/article/${payload.id}`,
};
const actionKeyLabels = { //something we currently have inside dotCMS
    'SIGN_ARTICLE_LICENSE' : 'sign license',
    'REVIEW_ARTICLE': 'review article',
    'CANCEL': 'Cancel',
    'CHECKOUT': 'Checkout'
};
const getLabel = (action) => { return actionKeyLabels[action.payload.key] };

const getNotifcations = () => shuffleArray([ //payload from backend
    {
        id: 1,
        type: 'info',
        context: {
            message: "Your article has been published online", //will be keys for dotCMS, currently just for a sample it is hardcode
            actions: [{
                actionKey: "OPEN_URL",
                payload: {
                    key: 'CHECKOUT',
                    url: 'http://onlinelibrary.wiley.com/doi/10.1002/9781119204305.ch2/summary',
                    target: '_blank'
                }
            }]
        }
    },
    {
        id: 2,
        type: 'action-required',
        context: {
            message: `Would you like to sign license for an article ${Math.floor(Math.random()*100)}?`,
            actions: [
                { actionKey: "NAVIGATE", payload: { key: "SIGN_ARTICLE_LICENSE", id: "aid1" + Math.random() } },
                { actionKey: "POST", payload: { key: 'CANCEL', url: "/api/remove/notif/1" } }
            ]
        }
    },
    {
        id: 3,
        type: 'action-required',
        context: {
            message: `You should review article ${Math.floor(Math.random()*100)}`,
            actions: [
                { actionKey: "NAVIGATE", payload: { key: "REVIEW_ARTICLE", id: "aid2" + Math.random() } },
                { actionKey: "POST", payload: { key: 'CANCEL', url: "/api/remove/notif/1" } }
            ]
        }
    }
]);


function onNotifNavigate(event) { //should we leave this page or change state?
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const isCurrentApp = isCurrentAppUrl && isCurrentAppUrl(href);
    window.location = href;
}

function doPost(url) {
    alert(` emaulate post to ${url}`);
}

function renderActions(actions) { //how to render notifications and GENERATE URLs
    return actions.map( action => {
        const {actionKey, payload} = action;
        switch (actionKey) {
            case 'NAVIGATE': return `<a onclick="onNotifNavigate(event)" href="${routes[payload.key](payload)}">${getLabel(action)}</a>`;
            case 'POST': return `<span onclick="doPost('${payload.url}')">${getLabel(action)}</span>`;
            case 'OPEN_URL': return `<a href="${payload.url}" ${payload.target & `target="${payload.target}"` }>${getLabel(action)}</a>`;
            default: return `unknown ${actionKey}`;
        }
    }).map(_ => `<span class="action"><button>${_}</button></span>`)
}

function renderNotification (item) {
    switch (item.type) {
        case 'info':
            return `${item.context.message} <div>${renderActions(item.context.actions)}</div>`;
        case 'action-required':
            return `${item.context.message} <div>${renderActions(item.context.actions)}</div>`;
        default:
            return `<span class="notification_unknown">unknown notif type "${item.type}"`
    };
};

function renderNotificationCenter() {
    document.querySelector('.notif-center').innerHTML = `<ul>
   ${getNotifcations().map(item => `<li class="notification notification_${item.type}">${renderNotification(item)}</li>`).join('')}
    </ul>`;

};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

setInterval(renderNotificationCenter, 10000, undefined, 100);

renderNotificationCenter();