export function FilterSearch({
  onSearch,
}: {
  onSearch: (searchText: string) => void;
}) {
  return (
    <tr>
      <td>
        <div>
          <label htmlFor="repo-search-textbox">Search</label>
        </div>
      </td>
      <td>
        <input
          id="repo-search-textbox"
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search projects..."
        />
      </td>
    </tr>
  );
}
