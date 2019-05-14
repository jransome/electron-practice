module.exports = (sequelize, DataTypes) => {
  const FocusSession = sequelize.define('FocusSession', {
    pid: DataTypes.INTEGER,
    exeName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    duration: DataTypes.BIGINT.UNSIGNED,
  }, {})

  FocusSession.associate = (models) => {
    FocusSession.belongsTo(models.Program)
  }

  return FocusSession
}