const crypto = require('crypto');

function checkSum(str) {
  const hashedVisitId = crypto.createHash('sha256').update(str).digest('hex');
  return hashedVisitId;
}

const visitCreationCheckSum = 'b333fr5678ijhy7890okju890polkjm55c31';
const preliminaryStr =
  '14431,2021-11-11T23:20:01,007Z,10102,10103,10692,b333fr5678ijhy7890okju890polkjm55c31';

if (visitCreationCheckSum !== checkSum(preliminaryStr)) {
  console.log('this checksum is not working');
}
