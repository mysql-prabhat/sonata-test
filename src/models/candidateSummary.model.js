module.exports = (sequelize, Sequelize) => {
  const Candidate = sequelize.define("candidate", {
    candidate_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
			autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    email_id: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    candidates_data: {
      type: Sequelize.JSON
    },
    created_date: {
      type: Sequelize.DATE
    },
    created_by: {
      type: Sequelize.STRING
    },
    modified_date: {
      type: Sequelize.DATE
    },
    modified_by: {
      type: Sequelize.STRING
    },
  },
		{
			timestamps: false,
		}
  );

  return Candidate;
};