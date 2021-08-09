from django.db import models


# Create your models here.
class newVariant_scn5a(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = "SCN5A_dataset"

    lqt3 = models.IntegerField(blank=True, null=False, default=0)
    brs1 = models.IntegerField(blank=True, null=False, default=0)
    var = models.TextField(primary_key=True, blank=False, null=True)
    unaff = models.IntegerField(blank=True, null=False, default=0)
    ref = models.TextField(blank=True, null=True)
    alt = models.TextField(blank=True, null=True)
    wtAA = models.TextField(db_column='nativeAA', blank=True, null=True)
    mutAA = models.TextField(blank=True, null=True)

    hgvsc = models.TextField(primary_key=True, db_column='HGVSc')
    pos = models.IntegerField(blank=True, null=True)
    total_carriers = models.IntegerField(blank=True, null=False, default=0)
    pph2_prob = models.TextField(blank=True, null=True)
    provean_score = models.TextField(blank=True, null=True)
    blast_pssm = models.TextField(db_column='blastpssm', blank=True, null=True)
    revel_score = models.TextField(db_column='REVEL', blank=True, null=True)
    brs1_dist = models.TextField(blank=True, null=True)
    lqt3_dist = models.TextField(blank=True, null=True)
    dnanum = models.IntegerField(blank=True, null=True)
    resnum = models.IntegerField(blank=True, null=True)
    alpha_brs1 = models.TextField(blank=True, null=True)
    beta_brs1 = models.TextField(blank=True, null=True)
    alpha_lqt3 = models.TextField(blank=True, null=True)
    beta_lqt3 = models.TextField(blank=True, null=True)

    gnomad = models.IntegerField(db_column='gnomAD', blank=False, null=False, default=0)  # Field name made lowercase.
    structure_brs1 = models.TextField(db_column='Structure_BrS1', blank=True, null=True)  # Field name made lowercase.
    structure_lqt3 = models.TextField(db_column='Structure_lqt3', blank=True, null=True)  # Field name made lowercase.
    function = models.TextField(db_column='Function', blank=True, null=True)  # Field name made lowercase.
    lqt3_penetrance = models.IntegerField(blank=True, null=True)
    brs1_penetrance = models.IntegerField(blank=True, null=True)

    @property
    def unaff_gnomad(self):
        return self.unaff + self.gnomad

    def __str__(self):
        return self.var


class scn5aPapers(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = "[SCN5A].[SCN5A_papers]"

    variant = models.TextField(db_column="Variant", blank=True, null=True)
    pmid = models.TextField(db_column="PMID", blank=True, null=True)

    # Clinical
    lqt3 = models.IntegerField(db_column="LQT3", default=0)
    year = models.TextField(db_column="Year", blank=True, null=True)
    residue = models.TextField(blank=True, null=True)
    brs1 = models.IntegerField(db_column="BrS", default=0)
    unaffected = models.IntegerField(db_column='Normal', default=0)
    other = models.IntegerField(db_column="Other", default=0)
    other_diag = models.TextField(db_column='Other_Disease', blank=True, null=True)
    total_carriers = models.IntegerField(db_column='Total', default=0)

    # Functional Data
    peak = models.TextField(db_column='I percent WT', blank=True, null=True)
    vhalf_act = models.TextField(db_column='deltaV0.5', blank=True, null=True)
    vhalf_inact = models.TextField(db_column='deltaV0.5inact', blank=True, null=True)
    late = models.TextField(db_column='deltaLate Current (percentofWT)', blank=True, null=True)
    cell_type = models.TextField(db_column='Model', blank=True, null=True)

    def __str__(self):
        return self.variant


class scn5aDistances(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = "[SCN5A].[SCN5A_distances]"

    pair_id = models.IntegerField(primary_key=True)
    resnum = models.IntegerField(blank=False, null=False)
    neighbor = models.IntegerField(blank=False, null=False)
    distance = models.FloatField(blank=False, null=False)

