import GetCountryRegions from "../Procedures/GetCountryRegions";
import GetNumberOfWineByReview from "../Procedures/GetNumberOfWineByReview";
import GetNumberOfReviewBtTasters from "../Procedures/GetNumberOfReviewByTasters";
import GetMostExpensiveWines from "../Procedures/GetMostExpensiveWines";
import GetAveragePointsOfWinePerCountry from "../Procedures/GetAveragePointsOfWinePerCountry";

const Sections = [
    {
        id: "get-country-regions",
        label: "Get Country Regions",
        content: <GetCountryRegions/>
    },
    {
        id: "get-number-of-reviews-by-winery",
        label: "Get Number Of reviews by winery",
        content: <GetNumberOfWineByReview/>
    },
    {
        id: "get-number-of-reviews-by-taster",
        label: "Get Number Of reviews by Taster",
        content: <GetNumberOfReviewBtTasters/>
    },
    {
        id: "get-most-expensive-wines",
        label: "Get Most Expensive Wines",
        content: <GetMostExpensiveWines/>
    },
    {
        id: "get-most-avarage-points-per-wine",
        label: "Get Avarage Points per Wine",
        content: <GetAveragePointsOfWinePerCountry/>
    }
];

export default Sections;