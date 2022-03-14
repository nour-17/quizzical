import React from "react";
import { nanoid } from "nanoid";
export default function Customize({ generate, buttonStyle }) {
  const [categories, setCategories] = React.useState([]);
  const [apiUrlData, setApiUrlData] = React.useState({
    category: "",
    difficulty: "",
  });
  const [difficulties, setDifficulties] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const difficultiesOptions = ["easy", "medium", "hard"];
  const selectedOption = {
    backgroundColor: "rgb(51, 51, 51)",
    color: "#F5F7FB",
    border: "1px solid rgb(51, 51, 51)",
  };
  React.useEffect(() => {
    setLoading(true);
    fetch("https://opentdb.com/api_category.php")
      .then(res => res.json())
      .then(data => {
        data.trivia_categories.unshift({
          id: 0,
          name: "Random",
          isSelected: true,
          key: nanoid(),
        });
        data.trivia_categories = data.trivia_categories.map(category => {
          let newName = category.name
            .split("Entertainment:")
            .join("")
            .split("Science:")
            .join("");
          return { ...category, name: newName };
        });
        setCategories(
          data.trivia_categories.map(category => {
            if (category.id !== 0) {
              return { ...category, isSelected: false, key: nanoid() };
            } else {
              return category;
            }
          })
        );
        setDifficulties(
          difficultiesOptions.map(option => {
            return {
              difficulty: option,
              isSelected: false,
              key: nanoid(),
            };
          })
        );
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  function selectCategory(id) {
    setApiUrlData(prev => ({ ...prev, category: id }));
    setCategories(prevOptions =>
      prevOptions.map(option => {
        let newOption = option;
        if (option.isSelected) {
          newOption = { ...option, isSelected: false };
        }
        if (option.id === id) {
          newOption = { ...option, isSelected: true };
        }
        return newOption;
      })
    );
  }
  function selectDifficulty(str) {
    setApiUrlData(prev => ({ ...prev, difficulty: str }));
    setDifficulties(prevOptions =>
      prevOptions.map(option => {
        let newOption = option;
        if (option.isSelected) {
          newOption = { ...option, isSelected: false };
        }
        if (option.difficulty === str) {
          newOption = { ...option, isSelected: true };
        }
        return newOption;
      })
    );
  }
  const categoriesElements = categories.map(category => {
    const styles = category.isSelected ? selectedOption : null;
    return (
      <button
        className="option"
        key={category.id}
        style={styles}
        onClick={() => selectCategory(category.id)}
      >
        {category.name}
      </button>
    );
  });
  const difficultyElements = difficulties.map(item => {
    const styles = item.isSelected ? selectedOption : null;
    const formattedItem =
      item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1);

    return (
      <button
        className="option"
        key={item.key}
        style={styles}
        onClick={() => selectDifficulty(item.difficulty)}
      >
        {formattedItem}
      </button>
    );
  });
  if (loading) {
    return (
      <div className="app">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="categories">
      <h1>categories</h1>
      <div className="categories--wrap">{categoriesElements}</div>
      <h1>difficulties</h1>
      <div className="categories--wrap">{difficultyElements}</div>
      <button
        style={buttonStyle}
        className="submit cutom-btn"
        onClick={() => generate(apiUrlData)}
      >
        Start
      </button>
    </div>
  );
}
