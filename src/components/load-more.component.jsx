const LoadMoreDataBtn = ({ state, FeatchDataFun }) => {
  if (
    state != null &&
    state.totalDocs > state.results.length &&
    state.results.length != 0
  ) {
    return (
      <button
        onClick={() => {
          FeatchDataFun({ page: state.page + 1 });
        }}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
};

export default LoadMoreDataBtn;
