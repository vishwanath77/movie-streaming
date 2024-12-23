import React, { useState } from 'react';
import { useContentStore } from '../store/content';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Search, Loader } from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('movie');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const { setContentType } = useContentStore();
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tab === 'movie' ? setContentType('movie') : setContentType('tv');
    setResults([]);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
      setResults(res.data.content);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Nothing found, are you searching under right category');
      } else {
        toast.error('An error occured, please try again later');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'movie' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('movie')}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'tv' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('tv')}
          >
            TV Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'person' ? 'bg-red-600' : 'bg-gray-800'
            } hover:bg-red-700`}
            onClick={() => handleTabClick('person')}
          >
            Person
          </button>
        </div>
        <form
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={'Search for a ' + activeTab}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-red-600" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results?.map((result) => {
              if (!result.poster_path && !result.profile_path) return null;
              return (
                <div className="bg-gray-950rounded" key={result.id}>
                  {activeTab === 'person' ? (
                    <div className="flex flex-col items-center group">
                      <img
                        src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                        className=""
                      />
                      <h2 className="mt-2 text-xl font-bold text-white opacity-0 group-hover:opacity-100">
                        {result.name}
                      </h2>
                    </div>
                  ) : (
                    <Link
                      to={'/watch/' + result.id}
                      onClick={() => {
                        setContentType(activeTab);
                      }}
                      className="group"
                    >
                      <img src={ORIGINAL_IMG_BASE_URL + result.poster_path} />
                      <h2 className="mt-2 text-xl font-bold text-white opacity-0 group-hover:opacity-100">
                        {result.title || result.name}
                      </h2>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
