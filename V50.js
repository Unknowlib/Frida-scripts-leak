const base = Module.findBaseAddress('libg.so');
const ServerConnection_сonnectTo =  base.add(0x43D5FC);
const Messaging_encryptAndWrite = base.add(0x73E9EC);
const State = base.add(0x73E284);
const PepperCrypto_secretbox_open = base.add(0x23C118);
const Messaging_sendPepperAuthentification = base.add(0x73E1B0);
const Unknowlib = {

    RedirectConnection(){
		Interceptor.attach(ServerConnection_сonnectTo, {
            onEnter(args) {
              args[1].add(8).readPointer().writeUtf8String("0.0.0.0");
              CryptoBypass.init();
            }
          });
    },
    CryptoBypass(){
        Armceptor.replace(Messaging_encryptAndWrite, [0x00, 0x00, 0x50, 0xE1]); // Messaging::encryptAndWrite
        Armceptor.replace(State, [0x05, 0x00, 0xA0, 0xE3]); // State
        Armceptor.replace(PepperCrypto_secretbox_open, [0x00, 0x40, 0xA0, 0xE3]); // PepperCrypto::secretbox_open
        Armceptor.replace(Messaging_sendPepperAuthentification, [0x02, 0x80, 0xA0, 0xE1]); // Messaging::sendPepperAuthentification
}
}


rpc.exports.init = function (stage, options) {
    Unknowlib.RedirectConnection();
}