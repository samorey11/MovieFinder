const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }

  throw new Error('Request was either a 404 or 500');
}

const json = (response) => response.json()

const Movie = (props) => {
  const {
    Title,
    Year,
    imdbID,
    Type,
    Poster,
  } = props.movie;

  return (
    <div className="row">
      <div className="col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <img src={Poster} className="img-fluid" />
        </a>
      </div>
      <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <h4>{Title}</h4>
          <p>{Type} | {Year}</p>
        </a>
      </div>
    </div>
  )
}

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_term: '',
      results: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(event) {
    this.setState({ search_term: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { search_term } = this.state;
    search_term = search_term.trim();
    if (!search_term) {
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${search_term}&apikey=5be4f737`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
      if(data.Response === 'False') {
        throw new Error(data.Error)
      }
      
      if(data.Response === 'True' && data.Search) {
        this.setState({ results: data.Search, error: ''});
      }
      
    }).catch((error) => {
      this.setState({ error: error.message });
      console.log(error);
    })

  }

  


  render() {
    const { search_term, results, error } = this.state;

    return (
      <div className="container">
        <h1 className="text-center mt-5 mb-3">Movie Finder</h1>
        <h2 className="text-center mb-3">Search one keyword from a movie title</h2>
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              Keyword: <input 
              type="text" 
              className="form-control mr-sm-2"
              placeholder="frozen"
              value={search_term}
              onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            {(() => {
              if(error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              })
            })()}
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render (
  <MovieFinder />,
  document.getElementById('root')
);