const { StrKey } = require('@stellar/stellar-sdk');

const CCT_ISSUER = 'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI';

console.log(`Length: ${CCT_ISSUER.length}`);
for (let i = 0; i < CCT_ISSUER.length; i++) {
  console.log(`${i}: ${CCT_ISSUER[i]} (${CCT_ISSUER.charCodeAt(i)})`);
}

console.log(`CCT valid: ${StrKey.isValidEd25519PublicKey(CCT_ISSUER)}`);
