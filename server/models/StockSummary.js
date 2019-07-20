class StockSummary {

    constructor(summaryData) {
        try {
            this.shortName = summaryData.body.quoteType.shortName;
            this.longName = summaryData.body.quoteType.longName;
            this.profile = summaryData.body.summaryProfile;
            this.details = summaryData.body.summaryDetail;
            this.financialData = summaryData.body.financialData;
        }
        catch(e) {
            // just for testing purposes
            this.shortName = "error in creating stock summary class";
            this.longName = "error in creating stock summary class";
            this.profile = "error in creating stock summary class";
            this.details = "error in creating stock summary class";
            this.financialData = "error in creating stock summary class";
        }
    }
}

module.exports.StockSummary = StockSummary;