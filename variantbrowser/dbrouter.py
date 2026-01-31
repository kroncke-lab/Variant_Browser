

class DemoRouter:
    """
    A router to control all database operations on models in the
    user application.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read user models go to test_db.
        """
        if model._meta.app_label == 'azure_data':
            return 'azure_sql_db'

        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write user models go to test_db.
        """
        if model._meta.app_label == 'azure_data':
            return 'azure_sql_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the user app is involved.
        """
        if obj1._meta.app_label == 'azure_data' or \
           obj2._meta.app_label == 'azure_data':
           return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the auth app only appears in the 'test_db'
        database.
        """
        if app_label == 'azure_data':
            return db == 'azure_sql_db'
        return None