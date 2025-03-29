const ActiveUsers = ({ listUsers }) => {
    return (
      <div>
        {listUsers.length > 0 ? (
          listUsers.map((user, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{user}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No active users</p>
        )}
      </div>
    );
  };
  
  export default ActiveUsers;
  