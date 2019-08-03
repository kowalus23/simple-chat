const Namespace =  require('../classes/Namespace');
const Room =  require('../classes/Room');

let namespaces = [];
let mmoNs = new Namespace(0,'MMO', '/mmo');
let techNs = new Namespace(1,'Technology','/technology');
let frontNs = new Namespace(2,'Front-End','/front-end');

mmoNs.addRoom(new Room(0,'World of Warcraft','MMO'));
mmoNs.addRoom(new Room(1,'Black Desert','MMO', true)); // true means private
mmoNs.addRoom(new Room(2,'Tibia','MMO'));
mmoNs.addRoom(new Room(3,'Guild Wars 2','MMO'));

techNs.addRoom(new Room(0,'Mobile','Technology'));
techNs.addRoom(new Room(1,'PC','Technology'));
techNs.addRoom(new Room(2,'Smart Home','Technology'));
techNs.addRoom(new Room(3,'VR','Technology', true));

frontNs.addRoom(new Room(0,'React','Front-End'));
frontNs.addRoom(new Room(1,'Vue','Front-End', true));
frontNs.addRoom(new Room(2,'Styles/Animations','Front-End'));
frontNs.addRoom(new Room(3,'Node.js','Front-End'));
frontNs.addRoom(new Room(4,'WebSockets','Front-End'));
frontNs.addRoom(new Room(5,'API','Front-End'));

namespaces.push(mmoNs, techNs, frontNs);

module.exports = namespaces;