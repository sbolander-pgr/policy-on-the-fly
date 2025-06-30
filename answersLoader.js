let answers = {};
const defaults = {
  customerPage: {
    businessName: "Policy-on-the-Fly",
    mailingAddress: "4061 ERIE ST",
    mailingAddressCity: "WILLOUGHBY",
    mailingAddressState: "OH",
    mailingAddressZip: "44094",

    firstName: "Bop",
    lastName: "LeBuilder",
    dob: "01/01/1980",
    phone: "444-444-4444",
    email: "test@e-ins.net",
  },
  businessDetailsPage: {
    yearCreated: "2018",
    annualSales: "150000",
    numEmployees: "0",
  },
  coveragesPage: {
    numPayments: 1,
  },
  summaryPage: {
    plIndicatorAdd: false,
  },
  finalDetailsPage: {
    producerName: "BOPAgent",
  },
  purchasePage: {
    nameOnCard: "Bop LeBuilder",
    cardNumber: "4111111111111111",
    cardExpirationDate: "12/30",
    cardholderZipCode: "44094",
  },
};

function loadAnswers(newAnswers) {
  Object.keys(defaults).forEach((page) => {
    answers[page] = { ...defaults[page], ...newAnswers[page] };
  });
  //console.log(answers);
}

module.exports = {
  answers: () => answers ?? defaults,
  defaults,
  loadAnswers,
};
