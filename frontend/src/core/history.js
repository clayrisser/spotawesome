import createHistory from 'history/createBrowserHistory';

export default process.env.BROWSER && createHistory();
