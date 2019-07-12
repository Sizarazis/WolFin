class StockSummary {

    constructor(summaryData) {
        try {
            this.profile = summaryData.body.summaryProfile;
            this.details = summaryData.body.summaryDetail;
            this.financialData = summaryData.body.financialData;
        }
        catch(e) {
            // just for testing purposes
            this.profile = "error in creating stock summary class";
            this.details = "error in creating stock summary class";
            this.financialData = "error in creating stock summary class";
        }
    }
}

module.exports.StockSummary = StockSummary;