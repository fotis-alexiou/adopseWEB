import React, { useEffect, useState } from "react";
import "./modules.scss";
import Module from "./module";
import Paginator from "./paginator";
import { useNavigate, useLocation } from "react-router-dom";

function Modules(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(
    parseInt(new URLSearchParams(location.search).get("page")) || 1
  );
  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [modules, setModules] = useState([]);
  const [pages, setPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [moduleIds, setModuleIds] = useState();
  const [isEnrolled, setIsEnrolled] = useState({});

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (pages === null) return;
    if (activeIndex > pages) {
      setActiveIndex(pages);
    }
  }, [pages, activeIndex]);

  async function fetchModules() {
    let retryCount = 0;
    const maxRetries = 3;
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };

      const response = await Promise.race([
        fetch(
          `/api/enrolled/filtered/${limit}/${offset}/?ModuleTypeId=${props.type}&DifficultyId=${props.difficulty}&price=${props.priceRange[0]},${props.priceRange[1]}&Rating=${props.stars[0]},${props.stars[1]}&SearchQuery=${searchQuery}&SearchType=${props.searchType}`,
          { headers }
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        ),
      ]);
      const data = await response.json();
      setModules(data.modules);
      setModuleIds(data.modules.map((module) => module.id));
      setPages(Math.ceil(data.count / limit));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying fetch... Attempt ${retryCount}`);
        fetchModules();
      } else {
        console.error(`Failed to fetch modules after ${maxRetries} attempts`);
        setFailedToLoad(true);
      }
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchModules();
  }, [
    limit,
    offset,
    props.stars,
    props.priceRange,
    props.type,
    props.difficulty,
    props.searchType
  ]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 3 || searchQuery.length == 0) {
        setIsLoading(true);
        fetchModules();
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchIsEnrolled() {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        };

        const requestBody = JSON.stringify({ moduleIds });

        const response = await Promise.race([
          fetch("/api/enrolled/getIsEnrolled", {
            method: "POST",
            headers,
            body: requestBody,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          ),
        ]);
        const data = await response.json();

        if (data.authorized === true) {
          const enrolledStatuses = data.isEnrolled.reduce((obj, item) => {
            obj[item.moduleId] = item.isEnrolled;
            return obj;
          }, {});
          setIsEnrolled(enrolledStatuses);
        }
      } catch (error) {
        console.error(error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying fetch... Attempt ${retryCount}`);
          fetchIsEnrolled();
        } else {
          console.error(
            `Failed to fetch enrollment statuses after ${maxRetries} attempts`
          );
        }
      }
    }

    if (moduleIds) {
      fetchIsEnrolled();
    }
  }, [moduleIds]);

  useEffect(() => {
    // if (pages === 0) return;
    console.log("Active Index: ", activeIndex);
    const newOffset = (activeIndex - 1) * limit;
    if (newOffset < 0) {
      setOffset(0);
    } else {
      setOffset(newOffset);
    }

    navigate(`?page=${activeIndex}`, { replace: true });
  }, [activeIndex, limit, navigate, pages]);

  return (
    <div className="modules">
      <div className="search-bar">
        <input
          className="search-query-input"
          type="text"
          name="searchQueryInput"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="search-query-submit"
          type="submit"
          name="searchQuerySubmit"
        >
          <svg viewBox="0 0 24 24">
            <path
              fill="#666666"
              d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
            />
          </svg>
        </button>
      </div>
      {isLoading ? ( // check if loading is true
        failedToLoad ? (
          <div>Failed to load modules. Please try again later.</div>
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <>
          {pages > 0 ? (
            <div className="modules-main">
              {modules.map((module, index) => (
                <Module
                  key={module.id}
                  id={module.id}
                  index={index}
                  school={module.name}
                  subject={module.name}
                  subject_type={module.moduleTypeName}
                  difficulty={module.difficultyName}
                  rating={module.rating}
                  enrolled={module.price}
                  price={module.price}
                  isEnrolled={isEnrolled[module.id]}
                />
              ))}
            </div>
          ) : (
            <div>No modules found for the selected Filters.</div>
          )}
          {pages > 0 && (
            <Paginator
              pageCount={pages}
              setActiveIndex={setActiveIndex}
              activeIndex={activeIndex}
            />
          )}
        </>
      )}
    </div>
  );
}
export default Modules;
