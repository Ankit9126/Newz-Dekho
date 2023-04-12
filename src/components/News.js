import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setarticles] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(1);
  const [totalResults, settotalResults] = useState([]);
   const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
   document.title = `Newz Dekho ${capitalize(props.category)}`;
 

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setloading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedata = await data.json();
    props.setProgress(70);

    setarticles(parsedata.articles);
    settotalResults(parsedata.totalResults);
    setloading(false);
    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `Newz Dekho ${capitalize(props.category)}`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // async componentDidMount() {
  //   this.updateNews();
  // }
  // prevclick = async () => {
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // };
  // nextclick = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // };
  const fetchMoreData = async () => {
    
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page + 1}&pageSize=${props.pageSize}`;
    setpage(page + 1 );
    // setloading(true );
    let data = await fetch(url);
    let parsedata = await data.json();
    setarticles(articles.concat(parsedata.articles));
    settotalResults(parsedata.totalResults);
  };

  return (
    <>
      <div className="container my-3">
        <h2 className="text-center  " style={{margin:"35px 0px", marginTop:"90px"}}>Daily Fresh Newzzz </h2>
      </div>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container my-3">
          <div className="row my-3 ">
            {articles.map((element, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    image={element.urlToImage}
                    source={element.source.name}
                    newsUrl={element.url}
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    author={element.author ? element.author : ""}
                    date={element.publishedAt ? element.publishedAt : ""}
                  ></NewsItem>
                </div>
              );
            })}
            ;
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between p-2">
            <button
              className="btn btn-dark"
              disabled={this.state.page <= 1}
              onClick={this.prevclick}
            >
              &larr; Previous
            </button>
            <button
              className="btn btn-dark"
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / props.pageSize)
              }
              onClick={this.nextclick}
            >
              Next &rarr;
            </button>
          </div> */}
    </>
  );
};
News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
